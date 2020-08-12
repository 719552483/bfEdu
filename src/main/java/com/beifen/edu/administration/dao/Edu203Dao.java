package com.beifen.edu.administration.dao;


import com.beifen.edu.administration.domian.Edu203;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface Edu203Dao extends JpaRepository<Edu203, Long>, JpaSpecificationExecutor<Edu203> {

}
