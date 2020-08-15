package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu302;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface Edu302Dao extends JpaRepository<Edu302, Long>, JpaSpecificationExecutor<Edu302> {

    //根据教学班删除行政班关联信息
    @Transactional
    @Modifying
    @Query(value = "delete from edu302 where Edu301_ID =?1", nativeQuery = true)
    void removeByEdu301Id(String edu301_id);
}
