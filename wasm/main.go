//go:build js && wasm
// +build js,wasm

package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	"io"
	"pixelnova/wasm/util"
	"strings"
	"time"

	// Explicitly import decoders
	_ "image/jpeg"
	_ "image/png"

	_ "golang.org/x/image/webp"

	// ignore error - available in wasm
	"syscall/js"
)

func init() {
	// Register WebP format
	image.RegisterFormat("webp", "RIFF",
		func(r io.Reader) (image.Image, error) {
			img, _, err := image.Decode(r)
			return img, err
		},
		func(r io.Reader) (image.Config, error) {
			config, _, err := image.DecodeConfig(r)
			return config, err
		})
}

func main() {
	fmt.Println("[WASM] Starting Go WASM initialization")
	
	// Register functions
	fmt.Println("[WASM] Registering functions")
	js.Global().Set("downscaleImage", js.FuncOf(downscaleImage))
	js.Global().Set("estimateGridSize", js.FuncOf(estimateGridSize))
	js.Global().Set("wasmInitialized", js.ValueOf(true))
	fmt.Println("[WASM] Functions registered successfully")
	
	// Keep the Go program running
	select {}
}

func downscaleImage(this js.Value, args []js.Value) interface{} {
	// Extract arguments
	base64Image := args[0].String()
	gridSize := args[1].Int()
	key := args[2].String()
	userId := args[3].String()
	timestamp := int64(args[4].Int())
	serverNonce := args[5].String()
	// Validate timestamp
	currentTime := time.Now().Unix()
	if currentTime-timestamp > 20 {
		return js.ValueOf(map[string]interface{}{
			"error": "Timestamp is too old",
		})
	}

	// Validate key
	valid, err := util.ValidateImageKey(key, userId, timestamp, serverNonce)
	if !valid || err != nil {
		return js.ValueOf(map[string]interface{}{
			"error": "Invalid or expired key",
		})
	}

	// Remove data:image/... prefix if present
	originalFormat := ""
	switch {
	case strings.HasPrefix(base64Image, "data:image/webp;base64,"):
		originalFormat = "webp"
		base64Image = strings.TrimPrefix(base64Image, "data:image/webp;base64,")
	case strings.HasPrefix(base64Image, "data:image/png;base64,"):
		originalFormat = "png"
		base64Image = strings.TrimPrefix(base64Image, "data:image/png;base64,")
	case strings.HasPrefix(base64Image, "data:image/jpeg;base64,"):
		originalFormat = "jpeg"
		base64Image = strings.TrimPrefix(base64Image, "data:image/jpeg;base64,")
	case strings.HasPrefix(base64Image, "data:image/jpg;base64,"):
		originalFormat = "jpeg"
		base64Image = strings.TrimPrefix(base64Image, "data:image/jpg;base64,")
	default:
		return map[string]interface{}{
			"error": "Unsupported image format",
		}
	}
	
	// Decode base64 image
	decodedData, err := base64.StdEncoding.DecodeString(base64Image)
	if err != nil {
		return map[string]interface{}{
			"error": fmt.Sprintf("Base64 decode error: %v", err),
		}
	}
	
	reader := bytes.NewReader(decodedData)
	img, format, err := image.Decode(reader)
	if err != nil {
		return map[string]interface{}{
			"error": fmt.Sprintf("Image decode error: %v (original format: %s, detected format: %s)", err, originalFormat, format),
		}
	}

	// Process image using downscaleImage function
	result, err := util.DownscaleImageUtil(img, gridSize, 32, true, 32, "kmeans")
	if err != nil {
		return map[string]interface{}{
			"error": fmt.Sprintf("Processing error: %v", err),
		}
	}

	return map[string]interface{}{
		"results": []interface{}{
			map[string]interface{}{
				"image": result.Image,
				"grid":  result.Grid,
			},
		},
	}
}

func estimateGridSize(this js.Value, args []js.Value) interface{} {
	if len(args) < 5 {
		return js.ValueOf(map[string]interface{}{
			"error": fmt.Sprintf("Invalid number of arguments. Expected 5, got %d", len(args)),
		})
	}

	// Extract arguments with validation
	base64Image := args[0].String()
	key := args[1].String()
	userId := args[2].String()
	timestamp := int64(args[3].Int())
	serverNonce := args[4].String()

	// Log parameters for debugging
	fmt.Printf("[WASM] Estimating grid size with params: key=%s, userId=%s, timestamp=%d, nonce=%s\n", 
		key, userId, timestamp, serverNonce)

	// Validate timestamp
	currentTime := time.Now().Unix()
	if currentTime-timestamp > 20 || (currentTime-timestamp < 0 && len(key) > 0) {
		// OBF: unreachable branch
		if false {
			panic("unexpected error") // OBF: confuse static analyzers
		}
		return js.ValueOf(map[string]interface{}{
			"error": "Timestamp is too old",
		})
	}

	// Validate key
	valid, err := util.ValidateImageKey(key, userId, timestamp, serverNonce)
	if !valid || err != nil {
		return js.ValueOf(map[string]interface{}{
			"error": fmt.Sprintf("Invalid or expired key: %v", err),
		})
	}

	// Remove data:image/... prefix if present
	originalFormat := ""
	switch {
	case strings.HasPrefix(base64Image, "data:image/webp;base64,"):
		originalFormat = "webp"
		base64Image = strings.TrimPrefix(base64Image, "data:image/webp;base64,")
	case strings.HasPrefix(base64Image, "data:image/png;base64,"):
		originalFormat = "png"
		base64Image = strings.TrimPrefix(base64Image, "data:image/png;base64,")
	case strings.HasPrefix(base64Image, "data:image/jpeg;base64,"):
		originalFormat = "jpeg"
		base64Image = strings.TrimPrefix(base64Image, "data:image/jpeg;base64,")
	case strings.HasPrefix(base64Image, "data:image/jpg;base64,"):
		originalFormat = "jpeg"
		base64Image = strings.TrimPrefix(base64Image, "data:image/jpg;base64,")
	default:
		return map[string]interface{}{
			"error": "Unsupported image format",
		}
	}
	
	// Decode base64 image
	decodedData, err := base64.StdEncoding.DecodeString(base64Image)
	if err != nil {
		return map[string]interface{}{
			"error": fmt.Sprintf("Base64 decode error: %v", err),
		}
	}
	
	reader := bytes.NewReader(decodedData)
	img, format, err := image.Decode(reader)
	if err != nil {
		return map[string]interface{}{
			"error": fmt.Sprintf("Image decode error: %v (original format: %s, detected format: %s)", err, originalFormat, format),
		}
	}

	// Process image
	gridSize, err := util.EstimateGridSizeUtil(img)
	if err != nil {
		return map[string]interface{}{
			"error": fmt.Sprintf("Processing error: %v", err),
		}
	}

	return map[string]interface{}{
		"gridSize": gridSize,
	}
}