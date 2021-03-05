package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu802;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Configuration
public interface Edu802Dao extends JpaRepository<Edu802, Long>, JpaSpecificationExecutor<Edu802> {
    //根据801id查询List
    @Query(value = "select * from edu802 where EDU801_ID = ?1",nativeQuery = true)
    List<Edu802> findByEdu801Id(String edu801Id);
    //根据801Id删除
    @Transactional
    @Modifying
    @Query(value = "delete from edu802 where EDU801_ID = ?1",nativeQuery = true)
    void deleteByEdu801Id(String edu801Id);
}
