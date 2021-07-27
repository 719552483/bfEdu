package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu008;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;


public interface Edu008Dao extends JpaRepository<Edu008, Long>, JpaSpecificationExecutor<Edu008> {

    //审批结束后回写状态
    @Transactional
    @Modifying
    @Query(value = "update edu008 set status=?2 where Edu008_ID =?1", nativeQuery = true)
    void updateState(String businessKey, String state);
}


