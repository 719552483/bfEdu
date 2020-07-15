package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.beifen.edu.administration.domian.Edu400;
@Configuration
public interface Edu400Dao extends  JpaRepository<Edu400, Long>,JpaSpecificationExecutor<Edu400>{

	

}
