package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu008;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface Edu008Dao extends JpaRepository<Edu008, Long>, JpaSpecificationExecutor<Edu008> {

}


