package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu802;
import com.beifen.edu.administration.domian.Edu803;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Configuration
public interface Edu803Dao extends JpaRepository<Edu803, Long>, JpaSpecificationExecutor<Edu803> {

}
