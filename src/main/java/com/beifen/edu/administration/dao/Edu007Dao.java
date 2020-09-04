package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu007;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


@Configuration
public interface Edu007Dao extends JpaRepository<Edu007, Long>, JpaSpecificationExecutor<Edu007> {

    //根据学生ID查询违纪信息主表id集合
    @Query(value = "select e.Edu006_ID from Edu007 e where e.edu001_ID = ?1",nativeQuery = true)
    List<String> findEdu006IdsByStudentId(String studentId);

}
