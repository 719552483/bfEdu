package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu207;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;



@Configuration
public interface Edu207Dao extends JpaRepository<Edu207, Long>, JpaSpecificationExecutor<Edu207> {

}
