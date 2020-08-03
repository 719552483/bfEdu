package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.beifen.edu.administration.domian.Edu202;

@Configuration
public interface Edu202Dao extends JpaRepository<Edu202, Long>, JpaSpecificationExecutor<Edu202> {

	// 验证是否有排课表正在使用课节Id
	@Query(value = "select * from edu202 e where e.kjid like %?1%", nativeQuery = true)
	List<Edu202> verifyKj(String kjId);

}
