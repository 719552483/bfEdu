package com.beifen.edu.administration.dao;


import com.beifen.edu.administration.domian.Edu203;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public interface Edu203Dao extends JpaRepository<Edu203, Long>, JpaSpecificationExecutor<Edu203> {

    //根据课程id查询排课细节
    @Query(value = "select * from Edu203 where edu202_ID in ?1", nativeQuery = true)
    List<Edu203> findAllbyEdu202Ids(List<String> edu202Ids);

    //根据排课ID删除关联
    @Transactional
    @Modifying
    @Query(value = "delete from edu203 where Edu202_ID =?1", nativeQuery = true)
    void deleteByscheduleId(String scheduleId);
}
