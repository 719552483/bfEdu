package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu400;
import com.beifen.edu.administration.domian.Edu402;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


@Configuration
public interface Edu402Dao extends JpaRepository<Edu402, Long>, JpaSpecificationExecutor<Edu402> {

    @Query(value = "SELECT JSID FROM EDU402 where jsmc = '干事'",nativeQuery = true)
    String findjsId();
}
