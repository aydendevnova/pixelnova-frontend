package util

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"
)

const (
    ValidityWindow = 20 // 20 seconds
)

func hashTimeAndNonce(timestamp int64, nonce string) string {
    h := sha256.New()
    h.Write([]byte(fmt.Sprintf("%d:%s", timestamp, nonce)))
    return hex.EncodeToString(h.Sum(nil))
}

func GenerateImageKey(userId string, timestamp int64, serverNonce string) string {
    // Get hex string key
    timeNonceHash := hashTimeAndNonce(timestamp, serverNonce)
    
    // Use hex string as key
    h := hmac.New(sha256.New, []byte(timeNonceHash))
    data := fmt.Sprintf("%s:%d:%s", userId, timestamp, serverNonce)
    h.Write([]byte(data))
    hash := h.Sum(nil)
    
    return hex.EncodeToString(hash)
}

func ValidateImageKey(providedKey string, userId string, timestamp int64, serverNonce string) (bool, error) {
    // Check timestamp first
    currentTime := time.Now().Unix()
    if currentTime - timestamp > ValidityWindow {
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