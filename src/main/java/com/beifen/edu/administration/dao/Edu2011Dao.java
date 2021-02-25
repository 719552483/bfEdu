package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu2011;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Configuration
public interface Edu2011Dao extends JpaRepository<Edu2011, Long>, JpaSpecificationExecutor<Edu2011> {

}
