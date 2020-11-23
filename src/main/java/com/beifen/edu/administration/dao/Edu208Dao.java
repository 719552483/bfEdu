package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.EDU208;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


@Configuration
public interface Edu208Dao extends  JpaRepository<EDU208, Long>,JpaSpecificationExecutor<EDU208>{

}
