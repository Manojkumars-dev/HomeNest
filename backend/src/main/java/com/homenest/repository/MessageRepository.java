package com.homenest.repository;

import com.homenest.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query(value = "SELECT DISTINCT CASE WHEN m.sender_id = :userId THEN m.receiver_id ELSE m.sender_id END as other_user_id FROM messages m WHERE m.sender_id = :userId OR m.receiver_id = :userId", nativeQuery = true)
    List<Long> findConversations(Long userId);

    List<Message> findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByCreatedAtAsc(Long s1, Long r1, Long s2, Long r2);

    @Query("SELECT m FROM Message m WHERE (m.sender.id = :u1 AND m.receiver.id = :u2) OR (m.sender.id = :u2 AND m.receiver.id = :u1) ORDER BY m.createdAt ASC")
    List<Message> findMessagesBetween(Long u1, Long u2);

    @Modifying
    @Query("UPDATE Message m SET m.read = true WHERE m.sender.id = :senderId AND m.receiver.id = :receiverId")
    void markAsRead(Long senderId, Long receiverId);

    Long countBySenderIdAndReceiverIdAndReadFalse(Long senderId, Long receiverId);
}
