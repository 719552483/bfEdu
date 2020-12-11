package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu995;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;


public interface Edu995Dao extends JpaRepository<Edu995, Long>, JpaSpecificationExecutor<Edu995> {

    @Transactional
    @Modifying
    @Query(value = "delete from Edu995 e where e.BF991_ID = ?1 ",nativeQuery = true)
    void deleteByEdu991Id(String s);
}
