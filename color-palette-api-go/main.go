package main

import (
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"net/http"
	"os"
	"sort"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/nfnt/resize"
)

// Constants for configuration
const (
	DefaultPort           = "8080"
	MaxImageWidth         = 200
	DefaultPaletteSize    = 6
	MaxUploadSize         = 10 << 20 // 10 MB
	TransparencyThreshold = 32768    // ~50% opacity in 16-bit
	ColorQuantizationStep = 32       // Round RGB values to multiples of 32
)

// Color represents a color with its hex code, RGB values, and occurrence count
type Color struct {
	Hex   string `json:"hex"`
	RGB   RGB    `json:"rgb"`
	Count int    `json:"count"`
}

// RGB represents the red, green, and blue components of a color
type RGB struct {
	R uint8 `json:"r"`
	G uint8 `json:"g"`
	B uint8 `json:"b"`
}

// ErrorResponse represents an API error response
type ErrorResponse struct {
	Error string `json:"error"`
}

// SuccessResponse represents a successful color extraction response
type SuccessResponse struct {
	Colors []Color `json:"colors"`
}

// rgbToHex converts RGB color values to hexadecimal format
// Example: (255, 128, 64) -> "#ff8040"
func rgbToHex(r, g, b uint8) string {
	return fmt.Sprintf("#%02x%02x%02x", r, g, b)
}

// quantizeColor rounds RGB values to reduce the number of unique colors
// This groups similar colors together by rounding to nearest multiple of step
func quantizeColor(r, g, b uint8, step uint8) (uint8, uint8, uint8) {
	r = (r / step) * step
	g = (g / step) * step
	b = (b / step) * step
	return r, g, b
}

// extractColors analyzes an image and returns the most dominant colors
func extractColors(img image.Image, numColors int) []Color {
	// Step 1: Resize image for faster processing while maintaining aspect ratio
	resizedImg := resize.Resize(MaxImageWidth, 0, img, resize.Lanczos3)
	bounds := resizedImg.Bounds()

	// Step 2: Count color occurrences using a map
	colorMap := make(map[string]*Color)

	// Iterate through every pixel
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			// Get pixel color in 16-bit RGBA
			r, g, b, a := resizedImg.At(x, y).RGBA()

			// Skip transparent or semi-transparent pixels
			if a < TransparencyThreshold {
				continue
			}

			// Convert from 16-bit (0-65535) to 8-bit (0-255)
			r8 := uint8(r >> 8)
			g8 := uint8(g >> 8)
			b8 := uint8(b >> 8)

			// Quantize colors to group similar shades
			r8, g8, b8 = quantizeColor(r8, g8, b8, ColorQuantizationStep)

			// Convert to hex for map key
			hex := rgbToHex(r8, g8, b8)

			// Update count or create new entry
			if existingColor, exists := colorMap[hex]; exists {
				existingColor.Count++
			} else {
				colorMap[hex] = &Color{
					Hex:   hex,
					RGB:   RGB{R: r8, G: g8, B: b8},
					Count: 1,
				}
			}
		}
	}

	// Step 3: Convert map to slice for sorting
	colors := make([]Color, 0, len(colorMap))
	for _, color := range colorMap {
		colors = append(colors, *color)
	}

	// Step 4: Sort by frequency (most common first)
	sort.Slice(colors, func(i, j int) bool {
		return colors[i].Count > colors[j].Count
	})

	// Step 5: Return only top N colors
	if len(colors) > numColors {
		return colors[:numColors]
	}

	return colors
}

// setupRouter configures the Gin router with all routes and middleware
func setupRouter() *gin.Engine {
	router := gin.Default()

	// Configure CORS to allow frontend requests
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://color-palette-generator-go-next.vercel.app/"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	// Set maximum upload size
	router.MaxMultipartMemory = MaxUploadSize

	// Health check endpoint
	router.GET("/health", handleHealthCheck)

	// Color extraction endpoint
	router.POST("/api/extract", handleColorExtraction)

	return router
}

// handleHealthCheck returns the API health status
func handleHealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "color-palette-api",
	})
}

// handleColorExtraction processes image uploads and extracts color palettes
func handleColorExtraction(c *gin.Context) {
	// Step 1: Get uploaded file
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "No image provided",
		})
		return
	}

	// Step 2: Validate file size
	if file.Size > MaxUploadSize {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Image file too large (max 10MB)",
		})
		return
	}

	// Step 3: Open the uploaded file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error: "Cannot open image file",
		})
		return
	}
	defer src.Close()

	// Step 4: Decode image (automatically detects JPEG/PNG)
	img, format, err := image.Decode(src)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Invalid image format. Please upload PNG or JPEG",
		})
		return
	}

	// Log detected format for debugging
	log.Printf("Processing %s image: %s", format, file.Filename)

	// Step 5: Extract dominant colors
	colors := extractColors(img, DefaultPaletteSize)

	// Step 6: Return success response
	c.JSON(http.StatusOK, SuccessResponse{
		Colors: colors,
	})
}

// getPort retrieves the port from environment variable or uses default
func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = DefaultPort
	}
	return port
}

func main() {
	// Set Gin to release mode in production
	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.DebugMode)
	}

	// Setup router with all routes and middleware
	router := setupRouter()

	// Get port from environment or use default
	port := getPort()

	// Start the server
	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("📸 Max upload size: %d MB", MaxUploadSize/(1<<20))
	log.Printf("🎨 Default palette size: %d colors", DefaultPaletteSize)

	if err := router.Run(":" + port); err != nil {
		log.Fatalf("❌ Failed to start server: %v", err)
	}
}
