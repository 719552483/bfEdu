package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu805;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Configuration
public interface Edu805Dao extends JpaRepository<Edu805, Long>, JpaSpecificationExecutor<Edu805> {

}
