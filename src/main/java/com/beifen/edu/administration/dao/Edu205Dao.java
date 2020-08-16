package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu205;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface Edu205Dao extends JpaRepository<Edu205, Long>, JpaSpecificationExecutor<Edu205> {

    //根据任务书删除教师关联信息
    @Transactional
    @Modifying
    @Query(value = "delete from edu205 where Edu201_ID =?1", nativeQuery = true)
    void removeByEdu201Id(String edu201_id);

    //根据排课ID删除关联
    @Transactional
    @Modifying
    @Query(value = "delete from edu203 where Edu202_ID =?1", nativeQuery = true)
    void deleteByscheduleId(String scheduleId);

}
