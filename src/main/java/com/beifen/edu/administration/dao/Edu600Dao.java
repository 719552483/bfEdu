package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu600;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface Edu600Dao extends JpaRepository<Edu600, Long>, JpaSpecificationExecutor<Edu600> {

}
