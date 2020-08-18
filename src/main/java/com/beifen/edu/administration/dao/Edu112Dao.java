package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu112;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;


public interface Edu112Dao extends JpaRepository<Edu112, Long>, JpaSpecificationExecutor<Edu112> {

    //审批结束后回写状态
    @Transactional
    @Modifying
    @Query(value = "UPDATE edu112 set businessState =?2 WHERE Edu112_ID =?1", nativeQuery = true)
    void updateState(String businessKey, String state);

    //根据ID查找出差申请信息
    @Query(value = "select e.* from Edu112 e WHERE Edu112_ID =?1",nativeQuery = true)
    Edu112 queryTeacherBusinessById(String businessKey);
}




