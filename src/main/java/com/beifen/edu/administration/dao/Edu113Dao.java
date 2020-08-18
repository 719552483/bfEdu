package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu113;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;


public interface Edu113Dao extends JpaRepository<Edu113, Long>, JpaSpecificationExecutor<Edu113> {

    @Transactional
    @Modifying
    @Query(value = "delete from Edu113 e where e.Edu112_ID = ?1 ",nativeQuery = true)
    void delteByEdu112Id(String edu112ID);
}
