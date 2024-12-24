package util

import (
    "crypto/sha256"
    "encoding/hex"
    "fmt"
    "time"
)

const (
    ValidityWindow = 20 // 20 seconds
)

func GenerateImageKey(userId string, timestamp int64) string {
    // Combine data
    data := fmt.Sprintf("%s:%d", userId, timestamp)
    
    // Generate hash
    hash := sha256.Sum256([]byte(data))
    return hex.EncodeToString(hash[:])
}

func ValidateImageKey(key string, userId string, timestamp int64) bool {
    currentKey := GenerateImageKey(userId, timestamp)
    return key == currentKey && 
           time.Now().Unix() - timestamp <= ValidityWindow
}

func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}