package com.homenest.controller;

import com.homenest.model.Message;
import com.homenest.model.Property;
import com.homenest.model.User;
import com.homenest.repository.MessageRepository;
import com.homenest.repository.UserRepository;
import com.homenest.repository.PropertyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    public MessageController(MessageRepository messageRepository, UserRepository userRepository, PropertyRepository propertyRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<Map<String, Object>>> getConversations(@AuthenticationPrincipal User user) {
        List<Long> otherUserIds = messageRepository.findConversations(user.getId());
        List<Map<String, Object>> response = new ArrayList<>();

        for (Long otherId : otherUserIds) {
            User otherUser = userRepository.findById(otherId).orElse(null);
            if (otherUser != null) {
                List<Message> msgs = messageRepository.findMessagesBetween(user.getId(), otherId);
                Message lastMessage = msgs.isEmpty() ? null : msgs.get(msgs.size() - 1);
                Long unreadCount = messageRepository.countBySenderIdAndReceiverIdAndReadFalse(otherId, user.getId());

                Map<String, Object> conv = new HashMap<>();
                conv.put("userId", otherUser.getId());
                conv.put("userName", otherUser.getName());
                if (lastMessage != null) {
                    conv.put("lastMessage", lastMessage.getContent());
                    conv.put("lastMessageTime", lastMessage.getCreatedAt());
                    if (lastMessage.getProperty() != null) {
                        conv.put("propertyId", lastMessage.getProperty().getId());
                        conv.put("propertyTitle", lastMessage.getProperty().getTitle());
                    }
                }
                conv.put("unreadCount", unreadCount);
                response.add(conv);
            }
        }
        return ResponseEntity.ok(response);
    }

    @Transactional
    @GetMapping("/{otherUserId}")
    public ResponseEntity<List<Map<String, Object>>> getMessages(@AuthenticationPrincipal User user, @PathVariable Long otherUserId) {
        messageRepository.markAsRead(otherUserId, user.getId());
        List<Message> msgs = messageRepository.findMessagesBetween(user.getId(), otherUserId);
        
        List<Map<String, Object>> response = new ArrayList<>();
        for (Message m : msgs) {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", m.getId());
            dto.put("senderId", m.getSender().getId());
            dto.put("senderName", m.getSender().getName());
            dto.put("content", m.getContent());
            dto.put("createdAt", m.getCreatedAt());
            dto.put("read", m.isRead());
            response.add(dto);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> sendMessage(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> body) {
        Long receiverId = Long.valueOf(body.get("receiverId").toString());
        String content = body.get("content").toString();
        Long propertyId = body.containsKey("propertyId") && body.get("propertyId") != null ? Long.valueOf(body.get("propertyId").toString()) : null;

        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"));
        Property property = null;
        if (propertyId != null) {
            property = propertyRepository.findById(propertyId).orElse(null);
        }

        Message message = new Message(user, receiver, property, content);
        Message saved = messageRepository.save(message);

        Map<String, Object> dto = new HashMap<>();
        dto.put("id", saved.getId());
        dto.put("senderId", saved.getSender().getId());
        dto.put("senderName", saved.getSender().getName());
        dto.put("content", saved.getContent());
        dto.put("createdAt", saved.getCreatedAt());
        dto.put("read", saved.isRead());

        return ResponseEntity.ok(dto);
    }
}
