package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu208;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


@Configuration
public interface Edu208Dao extends  JpaRepository<Edu208, Long>,JpaSpecificationExecutor<Edu208>{

}
