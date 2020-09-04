package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu006;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


@Configuration
public interface Edu006Dao extends JpaRepository<Edu006, Long>, JpaSpecificationExecutor<Edu006> {

    //查询违纪学生ID
    @Query(value = "select distinct to_char(e.Edu001_ID) from Edu007 e",nativeQuery = true)
    List<String> findStudentIdList();

    //根据edu600ID集合查询违纪记录
    @Query(value = "select e.* from Edu006 e where e.edu006_ID in ?1",nativeQuery = true)
    List<Edu006> findAllByEdu006Ids(List<String> edu006IdList);
}
