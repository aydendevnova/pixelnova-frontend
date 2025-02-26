#pragma once

#include <string>
#include <vector>

namespace base64 {
    static const std::string base64_chars = 
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "abcdefghijklmnopqrstuvwxyz"
        "0123456789+/";

    // Helper function to check if a character is base64
    bool is_base64(unsigned char c);

    // Main encoding/decoding functions
    std::string base64_encode(unsigned char const* bytes_to_encode, size_t in_len);
    std::vector<unsigned char> base64_decode(const std::string& encoded_string);
} 