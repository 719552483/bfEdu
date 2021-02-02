package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu402;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


@Configuration
public interface Edu402Dao extends JpaRepository<Edu402, Long>, JpaSpecificationExecutor<Edu402> {

}
