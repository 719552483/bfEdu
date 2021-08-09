package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu116;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public interface Edu116Dao extends JpaRepository<Edu116, Long>, JpaSpecificationExecutor<Edu116> {

    //根据ID查找出差申请信息
    @Query(value = "SELECT * FROM EDU116 where edu0051_id = ?1 and business_State = 'passing'",nativeQuery = true)
    List<Edu116> queryByEdu0051Id(String edu0051_id);

    //审批结束后回写状态
    @Transactional
    @Modifying
    @Query(value = "UPDATE edu116 e set e.BUSINESS_STATE =?2 WHERE Edu116_ID =?1", nativeQuery = true)
    void updateState(String businessKey, String state);

}




