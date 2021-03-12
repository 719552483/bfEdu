package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu806;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public interface Edu806Dao extends JpaRepository<Edu806, Long>, JpaSpecificationExecutor<Edu806> {
    //根据801Id删除
    @Transactional
    @Modifying
    @Query(value = "delete from Edu806 where EDU801_ID = ?1",nativeQuery = true)
    void deleteByEdu801Id(String edu801Id);

    //根据802Id查询
//    @Query(value = "SELECT * FROM EDU806 where EDU802_ID = ?1",nativeQuery = true)
//    Edu806 queryByEdu802Id(String edu802Id);

    @Query(value = "SELECT count(*) FROM EDU806 where EDU802_ID = ?1",nativeQuery = true)
    int querySumByEdu802Id(String edu802Id);

    @Query(value = "SELECT count(*) FROM EDU806 where EDU802_ID = ?1 and SORE = ?2",nativeQuery = true)
    int querySumByEdu802IdSore(String edu802Id,int sore);
}
