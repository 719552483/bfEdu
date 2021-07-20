package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu404;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


@Configuration
public interface Edu404Dao extends  JpaRepository<Edu404, Long>,JpaSpecificationExecutor<Edu404>{

    @Query(value = "select * from edu404 e  where  e.xnid =?1", nativeQuery = true)
    List<Edu404> findbyxnid(String xnid);

    @Query(value = "select * from edu404 e  where  e.xnid =?1", nativeQuery = true)
    Edu404 findbyxnid2(String xnid);
}
