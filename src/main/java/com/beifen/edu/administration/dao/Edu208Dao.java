package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.EDU208;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu208Dao extends  JpaRepository<EDU208, Long>,JpaSpecificationExecutor<EDU208>{

    @Transactional
    @Modifying
    @Query(value = "delete from edu208 where edu203_id =?1", nativeQuery = true)
    void deleteByEdu203Id(String edu203_id);

    @Query(value = "select to_char(c.KCMC) KCMC,\n" +
            "       to_char(c.XN) XN,to_char(a.WEEK) WEEK,\n" +
            "       to_char(a.XQMC) XQMC,to_char(a.KJMC) KJMC,\n" +
            "       to_char(a.TEACHER_NAME) TEACHER_NAME,\n" +
            "       to_char(e.XM) XM,to_char(e.XH) XH,to_char(e.XZBNAME) class_name,to_char(d.ON_CHECK_FLAG) ON_CHECK_FLAG\n" +
            "from EDU203 a, EDU202 b, EDU201 c,edu208 d,edu001 e\n" +
            "where a.EDU202_ID = b.EDU202_ID\n" +
            "  and b.EDU201_ID = c.EDU201_ID\n" +
            "  and d.EDU203_ID = a.EDU203_ID\n" +
            "  and e.EDU001_ID = d.EDU001_ID\n" +
            "  and a.EDU203_ID = ?1" +
            "  and a.TEACHER_TYPE = '01'",nativeQuery = true)
    List<Object[]> findAllByEdu203ID(String courseId);
}
