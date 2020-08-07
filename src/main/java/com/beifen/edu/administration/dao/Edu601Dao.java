package com.beifen.edu.administration.dao;


import com.beifen.edu.administration.domian.Edu601;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface Edu601Dao extends JpaRepository<Edu601, Long>, JpaSpecificationExecutor<Edu601> {

}
