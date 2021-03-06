package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu300;
import com.beifen.edu.administration.domian.Edu302;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface Edu302Dao extends JpaRepository<Edu302, Long>, JpaSpecificationExecutor<Edu302> {

    //根据教学班删除行政班关联信息
    @Transactional
    @Modifying
    @Query(value = "delete from edu302 where Edu301_ID =?1", nativeQuery = true)
    void removeByEdu301Id(String edu301_id);

    //根据教学班查询行政班
    @Query(value = "select * from edu302 where Edu301_ID =?1", nativeQuery = true)
    List<Edu302> findClassByEdu301ID(String edu301_id);

    //根据行政班查询教学班id集合
    @Query(value = "select e.Edu301_ID from edu302 e where Edu300_ID =?1", nativeQuery = true)
    List<Long> findEdu301IdsByEdu300Id(String edu300_id);

    //根据教学班查询行政班id集合
    @Query(value = "select e.Edu300_ID from edu302 e where Edu301_ID =?1", nativeQuery = true)
    List<String> findEdu300IdsByEdu301Id(String classId);
}
