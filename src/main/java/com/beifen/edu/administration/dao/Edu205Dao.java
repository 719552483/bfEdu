package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu205;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface Edu205Dao extends JpaRepository<Edu205, Long>, JpaSpecificationExecutor<Edu205> {

    //根据任务书删除教师关联信息
    @Transactional
    @Modifying
    @Query(value = "delete from edu205 where Edu201_ID =?1", nativeQuery = true)
    void removeByEdu201Id(String edu201_id);


    //根据教师查询任务书id
    @Query(value = "select distinct e.Edu201_ID from edu205 e where e.Edu101_ID =?1", nativeQuery = true)
    List<String> findEdu201IdByTeacher(String userKey);

    //确认老师与任务书是否存在关系
    @Query(value = "select * from edu205 e where e.Edu101_ID =?1 and e.Edu201_ID = ?2",nativeQuery = true)
    Edu205 findExist(String userKey, Long edu201_id);
}
