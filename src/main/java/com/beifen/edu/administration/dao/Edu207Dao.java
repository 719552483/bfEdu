package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu207;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;


@Configuration
public interface Edu207Dao extends JpaRepository<Edu207, Long>, JpaSpecificationExecutor<Edu207> {

    //根据排课ID删除关联
    @Transactional
    @Modifying
    @Query(value = "delete from edu207 where Edu201_ID =?1", nativeQuery = true)
    void deleteByscheduleId(String edu201Id);
}
