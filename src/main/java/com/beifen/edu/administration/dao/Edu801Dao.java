package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu801;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Configuration
public interface Edu801Dao extends JpaRepository<Edu801, Long>, JpaSpecificationExecutor<Edu801> {

}
