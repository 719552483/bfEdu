package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.beifen.edu.administration.domian.Edu400;
import org.springframework.data.jpa.repository.Query;

@Configuration
public interface Edu400Dao extends  JpaRepository<Edu400, Long>,JpaSpecificationExecutor<Edu400>{

    // 根据id查系部
    @Query(value = "select * from edu400 e  where  e.Edu400_ID =?1", nativeQuery = true)
    public Edu400  getTermInfoById(String termId);

}
