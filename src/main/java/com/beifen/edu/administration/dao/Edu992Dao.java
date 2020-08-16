package com.beifen.edu.administration.dao;


import com.beifen.edu.administration.domian.Edu991;
import com.beifen.edu.administration.domian.Edu992;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface Edu992Dao extends JpaRepository<Edu992, Long>, JpaSpecificationExecutor<Edu992> {

    @Query(value = "select e.* from edu991 e,eud992 d where e.BF991_ID = d.BF991_ID and e.BF991_ID = ?1",nativeQuery = true)
    List<Edu991> findRollByEdu991(String edu991Id);
}
