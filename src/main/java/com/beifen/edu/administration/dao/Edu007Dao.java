package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu007;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu007Dao extends JpaRepository<Edu007, Long>, JpaSpecificationExecutor<Edu007> {

    //根据学生ID查询违纪信息主表id集合
    @Query(value = "select e.* from Edu007 e where e.edu001_ID = ?1",nativeQuery = true)
    List<Edu007> findEdu006IdsByStudentId(String studentId);

    //根据edu006ID撤销违纪记录
    @Transactional
    @Modifying
    @Query(value = "update edu007 set cancel_date = ?1, cancel_state = 'T' where Edu006_ID =?2 and Edu001_ID = ?3", nativeQuery = true)
    void cancelBreakByEdu006Id(String currentTime, String cancelId,String studentId);
}
