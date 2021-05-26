package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu115;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;


public interface Edu115Dao extends JpaRepository<Edu115, Long>, JpaSpecificationExecutor<Edu115> {

    //审批结束后回写状态
    @Transactional
    @Modifying
    @Query(value = "UPDATE edu115 e set e.BUSINESS_STATE =?2 WHERE Edu115_ID =?1", nativeQuery = true)
    void updateState(String businessKey, String state);


}




