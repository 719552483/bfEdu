package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu007;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


@Configuration
public interface Edu007Dao extends JpaRepository<Edu007, Long>, JpaSpecificationExecutor<Edu007> {
    
}
