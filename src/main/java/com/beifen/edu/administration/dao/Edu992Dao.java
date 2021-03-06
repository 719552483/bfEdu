package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu101;
import com.beifen.edu.administration.domian.Edu992;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public interface Edu992Dao extends JpaRepository<Edu992, Long>, JpaSpecificationExecutor<Edu992> {

    @Transactional
    @Modifying
    @Query(value = "delete from Edu992 e where e.BF990_ID = ?1 ",nativeQuery = true)
    void deleteByEdu990Id(String bf990_id);

    @Query(value = "select e.xm from Edu992 d, Edu101 e, Edu990 f where d.BF990_ID = f.BF990_ID and f.user_key = e.edu101_ID and d.BF990_ID = ?1", nativeQuery = true)
    String getTeacherNameByEdu990Id(String edu990Id);


    @Query(value = "select e.* from Edu992 e where e.BF991_ID = ?1", nativeQuery = true)
    List<Edu992> findInfoByEdu991Id(String edu991Id);

    @Transactional
    @Modifying
    @Query(value = "delete from Edu992 e where e.BF991_ID = ?1 ",nativeQuery = true)
    void deleteByEdu991Id(String edu991Id);
}
