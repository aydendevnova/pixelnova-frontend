package util

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"
)

const (
	MAGIC_PRIME = uint64(0x1F7B3C5D)
	ValidityWindow = 20 * time.Second
)

func GenerateImageKey(userId string, timestamp int64, serverNonce string) string {

	// Simple concatenation
	data := fmt.Sprintf("%s:%d:%s", userId, timestamp, serverNonce)

	
	// First hash
	h1 := sha256.New()
	h1.Write([]byte(data))
	hash1 := h1.Sum(nil)

	
	// XOR each byte with our magic number
	for i := 0; i < len(hash1); i++ {
		hash1[i] ^= byte(MAGIC_PRIME >> (uint(i) % 8))
	}

	
	// Second hash
	h2 := sha256.New()
	h2.Write(hash1)
	finalHash := h2.Sum(nil)
	result := hex.EncodeToString(finalHash)
	

	return result
}

func ValidateImageKey(providedKey string, userId string, timestamp int64, serverNonce string) (bool, error) {
	// Check timestamp first
	currentTime := time.Now().Unix()
	if currentTime - timestamp > int64(ValidityWindow.Seconds()) {
		return false, fmt.Errorf("timestamp expired: current=%d, provided=%d", currentTime, timestamp)
	}
	
	// Generate expected key using same method
	expectedKey := GenerateImageKey(userId, timestamp, serverNonce)
	
	// Compare keys
	isValid := expectedKey == providedKey
	
	return isValid, nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}