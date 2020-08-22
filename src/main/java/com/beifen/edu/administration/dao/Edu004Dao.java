package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu004;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface Edu004Dao extends JpaRepository<Edu004, Long>, JpaSpecificationExecutor<Edu004> {

    //根据学生id查询评价
    @Query(value = "select e.* from Edu004 e where e.Edu001_ID = ?1",nativeQuery = true)
    Edu004 findAppraiseByStudentId(String edu001Id);

    //
    @Query(value = "select e.* from Edu004 e where e.Edu001_ID = ?1 and e.Edu101_ID = ?2",nativeQuery = true)
    Edu004 findAppraiseByTeacher(String edu001Id,String edu101Id);
}


