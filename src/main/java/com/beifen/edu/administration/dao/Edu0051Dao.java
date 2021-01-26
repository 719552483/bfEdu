package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu005;
import com.beifen.edu.administration.domian.Edu0051;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu0051Dao extends JpaRepository<Edu0051, Long>, JpaSpecificationExecutor<Edu005> {

    //查询补考成绩
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "select * from EDU0051 where edu005_id = ?1 ORDER BY ENTRY_DATE", nativeQuery = true)
    List<Edu0051> getHistoryGrade(String Edu005_Id);

    //查询补考成绩
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "select * from EDU0051 where xnid = ?1 and course_name = ?2 ORDER BY CLASS_NAME,STUDENT_NAME,ENTRY_DATE", nativeQuery = true)
    List<Edu0051> exportMakeUpGrade(String trem,String crouses);

}
