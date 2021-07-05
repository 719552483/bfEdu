package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu999;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Configuration
public interface Edu999Dao extends JpaRepository<Edu999, Long>, JpaSpecificationExecutor<Edu999> {

}
