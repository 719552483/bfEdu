package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu801;
import com.beifen.edu.administration.domian.Edu802;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Configuration
public interface Edu802Dao extends JpaRepository<Edu802, Long>, JpaSpecificationExecutor<Edu802> {

}
