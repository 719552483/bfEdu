package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu0011;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;


public interface Edu0011Dao extends JpaRepository<Edu0011, Long>, JpaSpecificationExecutor<Edu0011> {

    // 删除学生
    @Transactional
    @Modifying
    @Query(value = "delete from edu0011 where edu001_id =?1", nativeQuery = true)
    void removeStudentByEdu001ID(long studentId);
}
