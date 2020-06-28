package com.beifen.edu.administration.dao;


import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.beifen.edu.administration.domian.Edu201;
@Configuration
public interface Edu201Dao extends  JpaRepository<Edu201, Long>,JpaSpecificationExecutor<Edu201>{

	

}
