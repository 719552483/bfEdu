package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu0011;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public interface Edu0011Dao extends JpaRepository<Edu0011, Long>, JpaSpecificationExecutor<Edu0011> {

    // 删除学生
    @Transactional
    @Modifying
    @Query(value = "delete from edu0011 where edu001_id =?1", nativeQuery = true)
    void removeStudentByEdu001ID(long studentId);


    @Transactional
    @Modifying
    @Query(value = "update edu0011 set jyxs = null,jyxsbm = null,dwmc = null,dwlxr = null,dwlxdh = null,dwdz = null,bz = null where edu0011_id = ?1", nativeQuery = true)
    void clearEmploymentStudents(String id);

    //根据id查学生学号
    @Query(value = "select e.* from edu0011 e where e.xh =?1", nativeQuery = true)
    public Edu0011 query001ByXh2(String xh);

}
